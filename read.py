import csv
import json
stops_csv_file_path = 'stops.txt'
stops_json_file_path ='stops.json'
id_json_file_path = 'name-id.json'
 
def busStops(stops_csv_file_path,json_file_path):
    stops = {}

    with open(stops_csv_file_path,'r') as handler:
        csv_reader = csv.reader(handler)
        for rows in csv_reader :
            key = rows[1].strip()
            lat = rows[3].strip()
            long = rows[4].strip()
            stops[key] = [lat,long]
    with open(stops_json_file_path,'w') as json_file_handler:
        json.dump(stops, json_file_handler,indent = 4)

def names(stops_csv_file_path,id_json_file_path):
    ids = {}

    with open(stops_csv_file_path,'r') as handler:
        csv_reader = csv.reader(handler)
        for rows in csv_reader :
            key = rows[1].strip()
            id = rows[0].strip()
            ids[key] = [id]
    with open(id_json_file_path,'w') as json_file_handler:
        json.dump(ids, json_file_handler,indent = 4)



busStops(stops_csv_file_path, stops_json_file_path)
names(stops_csv_file_path,id_json_file_path)

