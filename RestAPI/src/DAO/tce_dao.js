
//Authentication with Database
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'colmena66@tucaminoempresarial2',
    host: 'tucaminoempresarial2.postgres.database.azure.com',
    database: 'capstone',
    password: '6rrz9afwZ1994!@',
    port: 5432,
})


const getQuestions = async () => {
    try {
        const res = await pool.query(
          `SELECT * FROM questions;`
        );
        console.log(res.rows)
        return res.rows;
      } catch (err) {
        return err;
      }

};

//aun falta definir bien como se va a filtrar
const getOrganizationsFiltered = async (stage, type) => {
    try {
        const res = await pool.query(
          `select O.name as Org_name, T.description as Org_Type, S.description as Org_stage
          from organization as O inner join business_type 
          as T on O.bt_id = T.bt_id
          inner join business_step as S on O.bs_id = S.bs_id
            where T.bt_id = $1 AND S.bs_id= $2
          order by O.bt_id desc`, [type, stage]
        );
        console.log(res.rows)
        return res.rows;
      } catch (err) {
        return err;
      }

};

const getOrganizationsByType = async (type) => {
    try {
        const res = await pool.query(
          `select * from organization where bt_id = $1 and is_active = true;`, [type]
        );
        console.log(res.rows)
        return res.rows;
      } catch (err) {
        return err;
      }
}


const saveAnswers = async (user_id,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) => {
  try {
    const res = await pool.query(
      `INSERT INTO public.answers(
        user_id, answers_1, answers_2, answers_3, answers_4, answers_5, answers_6, answers_7, answers_8, answers_9, answers_10, answers_11)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`, [user_id, a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11]
    );
    console.log(res.rows)
    return res.rows;
  } catch (err) {
    return err;
  }
}


const changeAnswers = async (user_id,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) => {
  try {
    const res = await pool.query(
      `UPDATE public.answers
      SET user_id=$1, answers_1=$2, answers_2=$3, answers_3=$4, answers_4=$5, answers_5=$6, answers_6=$7, answers_7=$8, answers_8=$9, answers_9=$10, answers_10=$11, answers_11=$12
      WHERE user_id=$1;`, [user_id, a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11]
    );
    console.log(res.rows)
    return res.rows;
  } catch (err) {
    return err;
  }
}

const setType = async (user_id, type) => {
  try {
    const res = await pool.query(
      `UPDATE public.users
      SET bt_id=$2
      WHERE user_id=$1;`, [user_id, type]
    );
    console.log(res.rows)
    return res.rows;
  } catch (err) {
    return err;
  }
};

module.exports = {
    getQuestions,
    getOrganizationsFiltered,
    getOrganizationsByType,
    saveAnswers,
    changeAnswers,
    setType
}