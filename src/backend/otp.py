import math
import random
import smtplib
import time

def generateOTP(): # This function will generate an otp to the given gmailID
    digits = "0123456789"
    OTP = ""
    for i in range(4):
        OTP += digits[math.floor(random.random()*10)]
    return OTP


def sendOTP(gmail, otp): # This function will send an otp to the given gmailID
    senderid = "pehchaantesting@gmail.com"
    senderpswd = "!@#123qwe"
    msg = """Subject: OTP for Pehchaan Admin\n\n""" + otp + " is your OTP."
    s = smtplib.SMTP('smtp.gmail.com', 587)  # Create an SMTP session
    s.starttls()  # start TLS for security
    s.login(senderid, senderpswd)  # Authentication by sender login
    s.sendmail('&&&&&&&&&&&', gmail, msg)  # send the mail
    #s.quit()  # Terminate the session