import os
import sys

'''
skripti, jolla voi skipata kaikki jest-testit halutussa kansiossa.
'''

dir_path = sys.argv[1]
try:
    reverse = sys.argv[2] == 'reverse'
except:
    reverse = False

directory = os.fsencode(dir_path)

for file in os.listdir(directory):
    filename = str(file)[2:-1]
    open_file = open('./{}/{}'.format(dir_path, filename), 'r')
    content = open_file.read()
    open_file.close()
    if reverse:
        content = content.replace('describe.skip(', 'describe(')
    else:
        content = content.replace('describe(', 'describe.skip(')
    open_file = open('./{}/{}'.format(dir_path, filename), 'w')
    open_file.write(content)
    open_file.close()
