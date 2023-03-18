
const {parse} = require('csv-parse');
const fs = require('fs');
const users=require('./users')
require('dotenv').config();

const updateRecord =async (req,res)=>{
    try {
      let file=process.env.FILEPATH;
        let records=[]

        fs.createReadStream(file)
        .pipe(parse({
          comment: '#',
          columns: true,
        }))
        .on('data', (data) => {
          const subObject = {};
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const parts = key.split('.');
              const subKey = parts[0];
              const subSubKey = parts[1];
              if(subSubKey){
              if (!subObject[subKey]) {
                subObject[subKey] = {};
              }
              subObject[subKey][subSubKey] = data[key];
            }else{
              subObject[subKey]=data[key]
            }
            }
          }
          records.push(subObject);
         
        })
        .on('error', (err) => {
          console.log(err);
        })
        .on('end', async () => {
            try {
                let dataTobeInsert=records.map(d=>{
                    let transformedObj={name:null,age:null,address:{},additional_info:{}}
                    for(const key in d){
                      switch(key){
                        case 'name':{
                          transformedObj.name=d[key].firstName +' '+ d[key].lastName;
                          break;
                        }
                        case 'age':{
                          transformedObj.age=d[key];
                          break;
                        }
                        case 'address':{
                          transformedObj.address=d[key]
                          break;
                        }
                        default :{
                          transformedObj.additional_info[key]=d[key]
                        }
                      }
                    }
                    return transformedObj;
                   })
                  await users.insertData(dataTobeInsert);
                let ageDistribution=  await users.getAgeDistribution();
               
                console.log('Age-Group','Percentage %')
                ageDistribution.forEach(obj=>{
                  console.log(obj.agegroup,'      ',obj.percentage)
                })
                  res.json({
                      success:true,
                      data:ageDistribution,
                      message:'Data inserted Successfully'
                  })
            } catch (error) {
               throw error;
            }
      
        });
       
    } catch (error) {
        res.status(error.StatusCode||500).json({
            success:false,
            message:error.message||'Internal Server Error'
        })
    }
  
}

module.exports={updateRecord}