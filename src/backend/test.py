import psycopg2
conn = psycopg2.connect(database ="postgres", user = "yashpriyadarshi",
                    password = "dep:1234", host = "dep.postgres.database.azure.com")
    
cur = conn.cursor()

personName="yashpriyadarshi465@gmail.com"

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

print(nameList)

