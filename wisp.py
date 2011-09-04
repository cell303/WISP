import os
import cgi
import hashlib
import wsgiref.handlers
import simplejson
import string
import random

# GQL Encoder
import json

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

# Must not be changed after first setup
PASSWORD_NUMBER = 8
PASSWORD_LENGTH = 21
PASSWORD_SET = string.ascii_uppercase + string.ascii_lowercase + string.digits #+ "!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"

class Password(db.Model):
	"""A combination of a weak with several strong passwords"""
	weak =  db.StringProperty()
	strong = db.ListProperty(str)
	strong1 = db.StringProperty()
	strong2 = db.StringProperty()
		
class MainPage(webapp.RequestHandler):
	"""Mainpage"""
	def get(self, file):

		if not file:
			file = 'index'
		
		is_main = False
		if file in 'index':
			is_main = True

		template_values = {
			'title': 'WISP',
			'subtitle': 'A simple password prompter',
			'nav': ['FAQ', 'ToS', 'About'],
			'file': file,
			'is_main': is_main
		}
								
		path = os.path.join(os.path.dirname(__file__), file + '.html')
		self.response.out.write(template.render(path, template_values))
		
class Whisper(webapp.RequestHandler):
	"""Retrives the strong passwords for a given weak password"""
	def post(self):
		weak = self.request.get('weak')	
		weak_hash = hashlib.sha224(weak).hexdigest()
		password = Password.all().filter('weak =', weak_hash).get()
		
		if not password:
			randoms = get_random_passwords(n=PASSWORD_NUMBER, len=PASSWORD_LENGTH, set=PASSWORD_SET)
			
			password = Password()
			password.weak = weak_hash
			
			for r in randoms:
				password.strong.append(r)
				
			password.put()
		
		# Integrate old passwords	
		if len(password.strong) is 0:
			merge_old_passwords(password)
		
		# if the PASSWORD_NUMBER has been altered
		if len(password.strong) < PASSWORD_NUMBER:
			fill_up_passwords(password)
					
		# Encode using the GQL Encoder
		data = json.encode(password.strong)
		
		self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
		self.response.out.write(data)
			
def get_random_passwords(n, len, set):
	"""Generates n random passwords out of a given set of chars with a length of len"""
	rnd = []
	for i in range(n):
		rnd.append(''.join(random.choice(set) for x in range(len)))
	return rnd		

def merge_old_passwords(password):
	"""Integrates the old passwords into the new system"""
	randoms = get_random_passwords(n=PASSWORD_NUMBER, len=PASSWORD_LENGTH, set=PASSWORD_SET)
	
	randoms[0] = password.strong1
	randoms[1] = password.strong2
			
	for r in randoms:
		password.strong.append(r)
				
	password.put()	

def fill_up_passwords(password):
	"""Fills up a given password model to the global number of strong passwords"""
	randoms = get_random_passwords(n=PASSWORD_NUMBER, len=PASSWORD_LENGTH, set=PASSWORD_SET)
	for r in randoms:
		if len(password.strong) < PASSWORD_LENGTH:
			password.strong.append(r)
		else:
			return

		
application = webapp.WSGIApplication(
	[('/whisper', Whisper),
	 (r'/(.*)', MainPage),
	],debug=True)
									 
def main():
	run_wsgi_app(application)
	
if __name__ == "__main__":
	main()

