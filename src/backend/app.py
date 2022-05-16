from flask import Flask, Response, request, jsonify
# from Scanner import getScanned 
import base64
from io import BytesIO
from PIL import Image
import numpy as np
# import 
import cv2
import psycopg2
import json
from otp import *
from computer_vision_run import getScanned
import json
app = Flask(__name__)

@app.route("/image", methods=['GET', 'POST'])
def image():
    if(request.method == "POST"):
        bytesOfImage = request.get_data()  
        conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
        cur = conn.cursor()

        query = """INSERT INTO JImage(Name,biodata) VALUES(%s,%s);"""
        val=("Name",bytesOfImage)
        cur.execute(query,val)
        conn.commit()
        conn.close()

        return "Image read"
    

@app.route("/final", methods=["GET"])
def final():

    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query="""SELECT biodata FROM JImage ORDER BY ID DESC LIMIT 1;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    imageData=""
    for data in rows:
        imageData=data[0]
        
    
    imageList=getScanned(imageData)

    imageStrData=[]
    for image in imageList:
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue())
        # img_str.decode("utf-8")
        imageStrData.append(img_str)

    
    for img_str in imageStrData:
        query = """INSERT INTO JImage(Name,biodata) VALUES(%s,%s);"""
        val=("Name",img_str)
        cur.execute(query,val)
    
    imgdict={}
    count=0
    for img in imageStrData:
        imgdict[count]=img.decode()
        count+=1
    
    conn.commit()
    conn.close()
    return imgdict
    # return "DONE"


@app.route("/savename",methods=["POST"])
def savename():
    
    data =request.get_json()
    print(data)
    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query="""SELECT biodata FROM JImage ORDER BY ID DESC LIMIT 12;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    imageData=""
    for rowData in rows:
        imageData=rowData[0]
        
        query = """INSERT INTO Images(Name,biodata, Date, person) VALUES(%s,%s, CURRENT_DATE, %s);"""
        val=(data["data"]["searchPhrase"], imageData, data["data"]["email"])
        cur.execute(query,val)
    conn.commit()
    conn.close()
    
    return "Name Inserted"

@app.route("/getdata", methods=["POST"])
def getData():

    data =request.get_json()

    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()

    # personName="yashpriyadarshi465@gmail.com"
    print(data)
    personName= data["email"]
    
    query="""SELECT Name, Date, Result FROM Images WHERE person = '{}';""".format(personName)

    cur.execute(query)
    rows = cur.fetchall()
    
    nameList={}
    for data in rows:
        if data[0] not in nameList:
            nameList[data[0]]=data
        else:
            continue


    for index in nameList:
        item= list(nameList[index])
        item[1]=str(item[1])
        nameList[index]=item

    return nameList
    
@app.route("/signin", methods=["POST"])
def signin():
    data =request.get_json()
    print(data["data"]["email"])
    
    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query="""SELECT Email, Name FROM Users;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    found=False
    personName=""
    for datas in rows:
        if datas[0]==data["data"]["email"]:
            found=True
            personName=datas[1]
            break
        
    if found==True:
        otp=generateOTP()
        sendOTP(data["data"]["email"], otp)
        dict={"otp": otp, "name": personName}
        return dict
    else:
        return "NO"
    
@app.route("/openimage", methods=["POST"])
def openimage():
    
    data =request.get_json()
    print(data["name"])
    # return "HELLO"
    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query= """SELECT biodata FROM Images WHERE Name= '{}'""".format(data["name"])
    
    cur.execute(query)
    
    rows = cur.fetchall()
    
    imageList=[]
    
    for data in rows:
        imageList.append(data[0])

    with open("imageToSave.png", "wb") as fh:
        newData=imageList[0]
        fh.write(newData)

    imageDict={}
    count=0
    for img in imageList:
        # img_str.decode("utf-8")
        imageDict[count]=(img.tobytes()).decode("utf-8")
        count+=1

    return imageDict
    # return img_str

@app.route("/delete", methods=["POST"])
def delete():
    
    data= request.get_json()
    
    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()
    query= """DELETE FROM Images WHERE Name= '{}'""".format(data["name"])
    
    cur.execute(query)
    
    conn.commit()
    conn.close()
    
    return "Name Deleted"

@app.route("/signup", methods=["POST"])
def signup():
    
    data= request.get_json()
    
    conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                        password = "dep:1234", host = "dep.postgres.database.azure.com")
        
    cur = conn.cursor()

    query="""SELECT Email, Name FROM Users;"""
    cur.execute(query)
    rows = cur.fetchall()
    
    found=False
    for datas in rows:
        if datas[0]==data["data"]["email"]:
            found=True
            break
        
    if found==True:
        return "NO"
    else:
        query= """INSERT INTO USERS(Name, Email) VALUES(%s,%s);"""
        val=(data["data"]["password"],data["data"]["email"])
        cur.execute(query,val)
        conn.commit()
        conn.close()
        
        
        otp=generateOTP()
        sendOTP(data["data"]["email"], otp)
        dict={"otp": otp, "name": data["data"]["password"]}
        return dict


# @app.route("/cancelimage", methods="POST")
# def cancelimage():
#     conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
#                         password = "dep:1234", host = "dep.postgres.database.azure.com")
        
#     cur = conn.cursor()
#     query="""delete from Images order by id desc limit 1"""
#     cur.execute(query)
#     conn.commit()
#     conn.close()

if __name__ == '__main__':
      app.run(host='172.21.12.205',port='5000')

# + (pass: dep:1234)
# psql -h dep.postgres.database.azure.com -d postgres -U yashpriyadarshi
# CREATE TABLE JImage(
#     ID SERIAL PRIMARY KEY,
#     NAME TEXT,
#     biodata bytea
# );

# CREATE TABLE Users(
#     ID SERIAL PRIMARY KEY,
#     NAME TEXT,
#     EMAIL TEXT
# );
# INSERT INTO USERS(Name, Email) VALUES('Yash','yashpriyadarshi465@gmail.com');
# biodata bytea
# ALTER TABLE Images 
# ADD COLUMN person TEXT DEFAULT 'yashpriyadarshi465@gmail.com';
# ADD COLUMN Date DATE DEFAULT CURRENT_TIMESTAMP,
# ADD COLUMN Result TEXT DEFAULT 'ISCHEMIC';

