const { pgp, db } = require("../db");

const columns = new pgp.helpers.ColumnSet(
  ["name", "age", "address", "additional_info"],
  { table: "users" }
);

const insertData = async (data) => {
  try {
    const query = pgp.helpers.insert(data, columns);
    await db.none(query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAgeDistribution = () => {
  try {
   let ageDistribution= db.any(`select '<20' as AgeGroup,
     ceil(count(case when age<20  then 1 end) * 100.0 / count(*)) as percentage
  from users
  union all 
  select '20-40'as AgeGroup,
      ceil(count(case when age between 20 and 40 then 1 end) * 100.0 / count(*)) as percentage
  from users
  union all 
  select '40-60'as AgeGroup,
     ceil( count(case when age between 40 and 60 then 1 end) * 100.0 / count(*)) as percentage
     from users
  union all
  select '>60'as AgeGroup,
      ceil(count(case when age > 60 then 1 end) * 100.0 / count(*)) as percentage
  from users`);
  console.log(ageDistribution)
  return ageDistribution;
  } catch (error) {
   throw error;
  }
};
module.exports = { insertData,getAgeDistribution };
