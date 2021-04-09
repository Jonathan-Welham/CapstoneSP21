# This wrapper class is no longer in use
# An issue was discoverd while testing inside the container 
# connecting to the mail server

import os
import imghdr
import smtplib
from email.message import EmailMessage

"""
NOTE: In order to send an email using a Python script
	  the sender must enable the use of less secure apps.
	  If the sender uses the 'gmail' mail sever they can do
	  so here: https://myaccount.google.com/lesssecureapps
"""


class Mailer:
	"""
	A class used to send email

	...

	Attributes
	----------
	Class variables...
	MAIL_SERVER : str
		a string used to define the mail server of origin
	EMAIL_ADDRESS : str
		the email address of the sender's email account
	EMAIL_PASSWORD : str
		the password of the sender's email account

	Instance Variables...
	message: instance of EmailMessage class
		an object containing email attributes such as the 
		subject, body, and attachments

	Methods
	-------
	set_message(subject, body, attachments)
		Manipulates user input into a plain text or html message
	send(recepients)
		Sends message to a specified list of recepients
	"""

	MAIL_SERVER = os.environ.get('MAIL_SERVER')
	EMAIL_ADDRESS = os.environ.get('EMAIL_ADDRESS')
	EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD')

	def set_message(self, subject: str, body: str, attachments=[]):
		""" 
		Defines message attributes 

		...

		Parameters
		----------
		subject : str
		    The subject of the email
		body : str
		    The body of the email
		attachments : list of str, optional
		    The path of image files to add as email attachments
		"""

		self.message = EmailMessage()

		self.message['From'] = self.EMAIL_ADDRESS
		self.message['Subject'] = subject

		# Body as plain text
		self.message.set_content(body)

		# Body as html, falls back to the former if receiver has html mail disabled
		# TODO: Set html message with actually relevant info.
		self.message.add_alternative(
			f'<!DOCTYPE html>\n'
			f'<html>\n'
			f'\t<body>\n'
			f'\t\t<h1 style="text-align: center;">This is an Automated Email</h1>\n'
			f'\t\t<p style="color: gray; text-align: center;">Delivered by the CIG Dashboard Tool</p>\n'
			f'\t\t<hr>\n'
			f'\t\t<p style="color: gray;">{body}</p>\n'
			f'\t</body>\n'
			f'</html>', subtype='html')

		# Append attachments to message, if any
		for file in attachments:
			with open(file, 'rb') as f:
				file_data = f.read()
				file_name = f.name
				file_type = imghdr.what(file_name)

				self.message.add_attachment(file_data, maintype='image', subtype=file_type, filename=file_name)

	def send(self, recepients):
		""" 
		Sends message to specified recepients

		...

		Parameters
		----------
		recepients : list of str
		    The subject of the email
		"""

		self.message['To'] = ', '.join(recepients)

		print('Sending!!!!!!!!!!!!!!!!!!!!!!!!!!1', flush=True)

		with smtplib.SMTP_SSL(self.MAIL_SERVER, 465) as smtp:
			smtp.login(self.EMAIL_ADDRESS, self.EMAIL_PASSWORD)
			smtp.send_message(self.message)
