#!/usr/bin/python3
# -*- coding: utf-8 -*-
import requests
def geturl(url):
    res = requests.head(url)
    return res.headers.get('location')
def insertStr(str1,str2,index):
    str_list = list(str1)
    str_list.insert(index,str2)
    str_2 = "".join(str_list)
    #print(str_2)
    return str_2
class contents:
    def __init__(self,a,b,c):
        self.link=a
        #print(self.link)
        self.name=b
        self.description=c
    def outer(self,whatFuck):
        #print(whatFuck)
        #print("yes")
        if whatFuck=="link":
            return ",\n\""+self.link+"\""
        elif whatFuck=="description":
            return ",\n\""+self.description+"\""
        elif whatFuck=="name":
            #print(self.name)
            return ",\n\""+self.name+"\""
typer=[]
def saver():
    #print(typer)
    doc = open('main.js', 'rt')
    data = doc.read()
    doc.close()
    #print(data)
    position=data.find("//linkEnd")
    #print(position)
    position=position-4
    insertLink=""
    for i in range(len(typer)):
        insertLink+=typer[i].outer("link")
    end=insertStr(data,insertLink,position)
    #print(end)
    doc = open('main.js','w')
    doc.write(end)
    doc.close()
    #
    doc = open('main.js', 'rt')
    data = doc.read()
    doc.close()
    position=data.find("//describEnd")
    position=position-4
    insertLink=""
    for i in range(len(typer)):
        insertLink+=typer[i].outer("description")
        #print(typer[i].outer("description"))
    end=insertStr(data,insertLink,position)
    doc = open('main.js','w')
    doc.write(end)
    doc.close()
    #
    doc = open('main.js', 'rt')
    data = doc.read()
    doc.close()
    position=data.find("//nameEnd")
    position=position-4
    insertLink=""
    for i in range(len(typer)):
        insertLink+=typer[i].outer("name")
    end=insertStr(data,insertLink,position)
    doc = open('main.js','w')
    doc.write(end)
    doc.close()
    #print(data)
def typeIn():
    while True:
        print(len(typer))
        inComeLink=input("链接：")
        if inComeLink=="quit":
            break
        elif inComeLink=="del":
            con=0
            if len(typer)==0:
                print("No thing to delete")
            else:
                typer.pop()
                con=1
            if con:
                continue
        elif inComeLink=="save":
            saver()
            break
        inComeName=input("名字：")
        InComeDescription=input("介绍：")
        if InComeDescription=="dd":
            InComeDescription=inComeName
        testUrl=inComeLink.find("t.cn")
        if testUrl!=-1:
            inComeLink=geturl(inComeLink)
        a = contents(inComeLink,inComeName,InComeDescription)
        typer.append(a)
print("欢迎来到录入界面")
cmd=input("请按a并回车开始录入......\n")
if cmd=="a":
    typeIn()