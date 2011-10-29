#!/usr/bin/env python
#
#       rc4.py - RC4, ARC4, ARCFOUR algorithm with random salt
#
#       Copyright (c) 2009 joonis new media
#       Author: Thimo Kraemer <thimo.kraemer@joonis.de>
#
#       This program is free software; you can redistribute it and/or modify
#       it under the terms of the GNU General Public License as published by
#       the Free Software Foundation; either version 2 of the License, or
#       (at your option) any later version.
#       
#       This program is distributed in the hope that it will be useful,
#       but WITHOUT ANY WARRANTY; without even the implied warranty of
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#       GNU General Public License for more details.
#       
#       You should have received a copy of the GNU General Public License
#       along with this program; if not, write to the Free Software
#       Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#       MA             02110-1301      , USA.
#

import random, base64

def crypt(data, key):
    """RC4 algorithm"""
    x = 0
    box = range(256)
    for i in range(256):
        x = (x + box[i] + ord(key[i % len(key)])) % 256
        box[i], box[x] = box[x], box[i]
    x = y = 0
    out = []
    for char in data:
        x = (x + 1) % 256
        y = (y + box[x]) % 256
        box[x], box[y] = box[y], box[x]
        out.append(chr(ord(char) ^ box[(box[x] + box[y]) % 256]))
    
    return ''.join(out)

def encrypt(data, key, encode=base64.standard_b64encode, salt_length=8):
    """RC4 encryption with random salt and final encoding"""
    salt = ''
    for n in range(salt_length):
        salt += chr(random.randrange(256))
    data = chr(salt_length) + salt + crypt(data, key + salt)
    if encode:
        data = encode(data)
    return data
    
def decrypt(data, key, decode=base64.standard_b64decode):
    """RC4 decryption of encoded data"""
    if decode:
        data = decode(data)
    pos = ord(data[0]) + 1
    salt = data[1:pos]
    return crypt(data[pos:], key + salt)



