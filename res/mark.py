#!/usr/bin/python3
totx=""
toty=""
totz=""
while True:
	x=input("x=")
	if str(x)=="exit":
		doc = open('out.txt','w')
		doc.write(totx)
		doc.write("\n\n\n")
		doc.write(toty)
		doc.write("\n\n\n")
		doc.write(totz)
		doc.write("\n\n\n")
		doc.close()
	y=input("y=")
	z=input("z=")
	a="\""+str(x)+"\""
	totx+=",\n"
	totx+=a
	a="\""+str(y)+"\""
	toty+=",\n"
	toty+=a
	a="\""+str(z)+"\""
	totz+=",\n"
	totz+=a
doc = open('out.txt','w')
doc.write(totx)
doc.write("\n\n\n")
doc.write(toty)
doc.write("\n\n\n")
doc.write(totz)
doc.write("\n\n\n")

x=input("")

