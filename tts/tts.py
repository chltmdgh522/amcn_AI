# -*- coding: utf-8 -*-

# import speech_recognition as sr

from gtts import gTTS

import os

import time

import playsound

import sys
import pyttsx3
"""
def speak(text):
    tts = gTTS(text=text, lang='ko')
    tts.save("output.mp3")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        content = sys.argv[1]
        speak(content)
    else:
        print("No content provided")
        """

# def speak(text):
#
#      tts = gTTS(text=text, lang='ko')
#
#      filename='voice2.mp3'
#
#      tts.save(filename)
#      print(text)
#      playsound.playsound(filename)
#
def speak(content):
    engine = pyttsx3.init()
    engine.setProperty('rate', 230)
    engine.say(content)
    engine.runAndWait()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        content = sys.argv[1]
        speak(content)
    else:
        print("No content provided")

