import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import csv

# Use a service account.
cred = credentials.Certificate('projx-hbp-firebase-adminsdk-f6uaz-0eff5b763a.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

tags = []
# with open('projects5v1.csv', 'r') as csvfile:
#     reader = csv.reader(csvfile, delimiter=',')
#     for row in reader:
        # 0 = UID
        # 1 = Company name
        # 2 = Compensation $$
        # 3 = Project Name
        # 4 = Start date
        # 5 = End date
        # 6 = tags 
        # 7 = description
        
        ######## UPLOAD PROJECTS TO FIRESTORE ##########
        # data = {
        #     "applications" : [],
        #     "assignee" : "",
        #     "company" : row[0].strip(),
        #     "compensation" : int(row[2].strip()),
        #     "startDate" : row[4].strip(),
        #     "endDate" : row[5].strip(),
        #     "tags" : row[6].strip().split(", "),
        #     "status" : 1,
        #     "description" : row[7].strip(),
        #     "title": row[3].strip(),
        # }
        
        # db.collection("projects").add(data)
    #     tags += row[6].strip().split(", ")
    # tags = list(set(tags))
    # tags.sort()
    # for x in tags:
    #     print(x)
        
        

# with open('companies.csv', 'r') as csvfile:
#     reader = csv.reader(csvfile, delimiter=',')
#     counter = 0
#     for row in reader:
#         # 0 = name
#         # 1 = imagelink
#         # 2 = type
#         # 3 = website
#         # 4 = tags
#         # 5 description
        
#         ########### adding companies to document ##############
#         data = {
#             "name" : row[0].strip(),
#             "type" : row[2].strip(),
#             "description" : row[5].strip(),
#             "imageLink" : row[1].strip(),
#             "website" : row[3].strip(),
#             "tags" : row[4].strip().split(", "),
#             "projects" : [],
#             "access" : [],
#         }
#         db.collection("companies").add(data)
#         print(len(row))
        
#         if counter == 5:
#             exit()
#         counter+=1
        
        ############## getting UIDs based on company ################
        # company_name = row[0].strip()
        # company = db.collection("companies").where("name", "==", company_name).get()
        # for doc in company:
        #     company_id = doc.id
        #     print(company_id)
        
        
### GETTING PROJECTS UNDER COMPANY COLLECTION ####

# docs = db.collection("companies").stream()
# for doc in docs:
#     uid = doc.id
#     data = {"projects" : []}
#     projects = db.collection("projects").stream()
#     for project in projects:
#         project_data = project.to_dict()
#         if project_data["company"] == uid:
#             data["projects"].append(project.id)
#     db.collection("companies").document(uid).update(data)
    
#### POPULATE STUDENTS #####
# with open('students.csv', 'r') as csvfile:
#     reader = csv.reader(csvfile, delimiter=',')
#     count = 0
#     for row in reader:
#         # 0 = Name
#         # 1 = Email
#         # 2 = Linkedin
#         # 3 = Major
#         # 4 = School
#         # 5 = Tags
#         data = {
#             "email" : row[1].strip(),
#             "linkedin" : row[2].strip(),
#             "major" : row[3].strip(),
#             "name" : row[0].strip(),
#             "projects" : [],
#             "school" : row[4].strip(),
#             "tags" : row[5].strip().split(", "),
        #       "applications" : [],
#         }
        
#         db.collection("students").add(data)
#         if count == 5:
#             exit()
#         count+=1
        
