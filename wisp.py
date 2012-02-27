import os
import hashlib
import simplejson
import string
import random
import copy			
import rc4

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

# Must not be changed after first setup
PASSWORD_NUMBER = 8
PASSWORD_LENGTH = 42
PASSWORD_SET = string.ascii_uppercase + string.ascii_lowercase + string.digits

class Password(db.Model):
	"""A combination of a weak with several strong passwords"""
	weak =  db.StringProperty(required=True)
	strong = db.ListProperty(str)
	
	lowercase = db.BooleanProperty(required=True)
	uppercase = db.BooleanProperty(required=True)
	digits = db.BooleanProperty(required=True)
	special = db.BooleanProperty(required=True)
	
	strong1 = db.StringProperty()
	strong2 = db.StringProperty()

	encrypted = db.BooleanProperty()

class MainPage(webapp.RequestHandler):
	def get(self, file):
		"""query = Password.all()
		entries =query.fetch(9999)
		db.delete(entries)"""

		is_main = False
		
		if not file:
			file = 'index'
		
		if not file in ['index','faq','terms','about','settings','simple']:
			file = '404'

		if file == 'index' or file == 'simple':
			is_main = True

		template_values = {
			'title': 'WISP',
			'subtitle': 'A simple password prompter',
			'version': 'version 0.8',
			'nav': ['FAQ', 'Terms', 'About'],
			'file': file,
			'is_main': is_main
		}
								
		path = os.path.join(os.path.dirname(__file__), 'pages/' + file + '.html')
		self.response.out.write(template.render(path, template_values))
		
class Whisper(webapp.RequestHandler):
	"""Retrives the strong passwords for a given weak password"""
	def get(self):
		data = self.request.get('data').encode('utf-8')
		data = simplejson.loads(data)

		weak = data['weak']
		key = weak.encode('ascii', 'replace')

		weak_hash = hashlib.sha224(key).hexdigest()

		charset = PASSWORD_SET
		options = dict()
		options['uppercase'] = options['lowercase'] = options['numeric'] = True
		options['special'] = False
		
		if data['chars']:
			options = data['chars']
			if options['uppercase'] or options['lowercase'] or options['numeric'] or options['special']:
				charset = ''
				if options['uppercase']: 
					charset += string.ascii_uppercase
				if options['lowercase']:
					charset += string.ascii_lowercase
				if options['numeric']:
					charset += string.digits
				if options['special']:
					charset += "!#$%&'()*+,-./:;=?@[\]^_`{|}~"
			else:
				options['uppercase'] = options['lowercase'] = options['numeric'] = True
				options['special'] = False
			
		password = Password.all()
		password = password.filter('weak =', weak_hash)
		password = password.filter('lowercase =',options['lowercase'])
		password = password.filter('uppercase =',options['uppercase'])
		password = password.filter('digits =',options['numeric'])
		password = password.filter('special =',options['special'])
		password = password.get()

		if not password:
			randoms = get_random_passwords(n=PASSWORD_NUMBER, len=PASSWORD_LENGTH, set=charset)
			
			password = Password(
				weak = weak_hash,
				uppercase = options['uppercase'],
				lowercase = options['lowercase'],
				digits = options['numeric'],
				special = options['special']
			)

			for r in randoms:
				r = rc4.encrypt(r,key)
				password.strong.append(r)

			password.encrypted = True
			password.put()
		
		if password.encrypted == True:
			for i in range(len(password.strong)):
				password.strong[i] = rc4.decrypt(password.strong[i], key)
		else:
			encrypt_and_put(password, key)

		# Integrate old passwords	
		if len(password.strong) is 0:
			merge_old_passwords(password, charset)
			encrypt_and_put(password, key)
		
		# if the PASSWORD_NUMBER has been altered
		if len(password.strong) < PASSWORD_NUMBER:
			fill_up_password_number(password, charset)
			encrypt_and_put(password, key)

		if len(password.strong) > PASSWORD_NUMBER:
			password.strong = password.strong[:PASSWORD_NUMBER]   
			
		# if the PASSWORD_LENGTH has been altered
		if len(password.strong[0]) < PASSWORD_LENGTH:
			fill_up_password_length(password, charset)
			encrypt_and_put(password, key)
		
		if len(password.strong[0]) > PASSWORD_LENGTH:
			for i in range(len(password.strong)):
				password.strong[i] = password.strong[i][:PASSWORD_LENGTH]

		# Encode using the GQL Encoder
		rest = list()
		for i in range(len(password.strong)):
			rest.append({'id': i, 'password': password.strong[i][:data['length']]})
		
		data = simplejson.dumps(rest)
		
		self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
		self.response.out.write(data)

def encrypt_and_put(password, key):
	"""Encrypts and puts the password in the db but the original remains unaltered"""
	backup = copy.copy(password.strong)

	for i in range(len(password.strong)):
		password.strong[i] = rc4.encrypt(password.strong[i], key)
	password.encrypted = True
	password.put() 

	password.strong = backup

def get_random_passwords(n, len, set):
	"""Generates n random passwords out of a given set of chars with a length of len"""
	rnd = []
	for i in range(n):
		rnd.append("".join(random.choice(set) for x in range(len)))
	return rnd		

def merge_old_passwords(password, set):
	"""Integrates the old passwords into the new system"""
	randoms = get_random_passwords(n=PASSWORD_NUMBER, len=PASSWORD_LENGTH, set=set)
	
	randoms[0] = password.strong1
	randoms[1] = password.strong2

	for r in randoms:
		password.strong.append(r)
				
	return password


def fill_up_password_number(password, set):
	"""Fills up a given password model to the global number of strong passwords"""
	randoms = get_random_passwords(n=PASSWORD_NUMBER, len=PASSWORD_LENGTH, set=set)
	for r in randoms:
		if len(password.strong) < PASSWORD_LENGTH:
			password.strong.append(r)
		else:
			break
	return password

def fill_up_password_length(password, set):
	"""Fills up a given password with randoms chars to the global maximum"""
	randoms = get_random_passwords(n=PASSWORD_NUMBER, len=PASSWORD_LENGTH, set=set)
	for i in range(PASSWORD_NUMBER):
		length = len(password.strong[i])
		password.strong[i] += randoms[i][length:]
	return password

application = webapp.WSGIApplication(
	[('/whisper', Whisper),
	 (r'/(.*)', MainPage),
	],debug=True)
									 
def main():
	run_wsgi_app(application)
	
if __name__ == "__main__":
	main()

