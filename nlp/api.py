import requests
import json
import time
 

print("Enter the q_id",end="\n")
q_id=int(input())
print("Enter the ans_id",end="\n")
ans_id=int(input())

url="https://still-basin-66429.herokuapp.com/submitsolution/{}/{}".format(q_id,ans_id)
print(url)
res=requests.get(url)
hash_i=(res.text)
print(res)
time.sleep(8)
url="https://still-basin-66429.herokuapp.com/distributewin/{}".format(q_id)
print(url)
res=requests.get(url)
hash_i=(res.text)
print(hash_i)
