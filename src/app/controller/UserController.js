import * as Yup from 'yup';
import { password } from '../../config/database';
import User from '../models/User'

class UserController{
    async store(req, res){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({ message: 'Ooops dados inválidos'})
        }

        const userExists = await User.findOne({ 
            where: { 
                email: req.body.email 
            }
        });

        if(userExists){
            return res.status(401).json({ message: 'Usuário já cadastrado'})
        }

        const { id, name, email } = await User.create(req.body);
        return res.json({id, name, email});
    };

    async index(req, res){
        const person = {
            name:"nome da pessoa",
            age: 21
        }
        return res.status(200).json(person);
    };
   
    async delete(req, res){
        return res.status(200).json({message: 'isso ai psiti'});
    };
    async update(req, res){
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().when('oldPassword', 
            (oldpassword, field) => oldpassword ? field.required().min(6) : field
            ),
            confirmPassword: Yup.string().when('password',
             (password, field) => password ? field.required().min(6).oneOf([Yup.ref('password')]) : field
            ),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({
                message: 'falha na validadção'
            })
        }

       // console.log(req.userEmail)

       const { email, oldPassword } = req.body;

       const user = await User.findByPk(req.userId)
       console.log('email informado no banco', user.email)
       console.log('email informado no body', email)

        if(email !== user.email){
          const userExists = await User.findOne({ where: {email}})
           //retorno
           if(userExists){
               return res.status(400).json({ message: 'Verifique email informado'})
           }
           return res.status(400).json({message:'email não confere'})
        }
       
       if( oldPassword && !(await user.checkPassword(oldPassword))){
            return res.status(400) .json({message: 'senha não confere'})
       }

       const { id, name, employee } = await user.update(req.body);

       //const user = await User.findByPk(req.userId)

      // console.log(user)

        return res.status(200).json({
            id, 
            name, 
            employee
        });
    };
}

export default new UserController();