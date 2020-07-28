# by Lakphy
# https://lakphy.me
# This program is used to crawl the special instructions on the admissions of Inner Mongolia in the admissions regulations of various colleges and universities on the Sunshine College Entrance Examination, to help Inner Mongolia candidates quickly understand the admissions policies of the college
# 本程序用于爬取阳光高考网上各个院校的招生章程中对内蒙古招生的特殊说明，以帮助内蒙古考生快速了解该院校的招生政策
# Only for learning and communication
# 仅限用于学习交流使用
# CopyRight
# 
from urllib import parse,request
import requests
import time
def getobj(num):
    header_dict = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'}
    url="https://gaokao.chsi.com.cn/zsgs/zhangcheng/listZszc--schId-"+str(num)+".dhtml"
    req = request.Request(url='%s' % (url),headers=header_dict)
    res = request.urlopen(req)
    res = res.read()
    out=res.decode(encoding='utf-8')
    arr1=out.split("<a href=\'")
    if len(arr1)<=1:
        return
    arr2=arr1[1].split("\'")
    url="https://gaokao.chsi.com.cn"+arr2[0]
    req = request.Request(url='%s' % (url),headers=header_dict)
    res = request.urlopen(req)
    res = res.read()
    out=res.decode(encoding='utf-8')
    arr1=out.split("<h2 class=\"center\" style=\"margin-top:0;\">")
    arr2=arr1[1].split("</h2>")
    arr3=arr2[0].split("招生章程")
    print(arr3[0])
    arr3=arr2[1].split("内蒙古")
    if len(arr3)<=1:
        print("该校对内蒙古自治区招生无特殊说明\n####################\n")
        return
    arr4=arr3[1].split("</p>")
    print("内蒙古"+arr4[0]+"\n####################\n")
for i in range(1,921):
    getobj(i)
    time.sleep(1)