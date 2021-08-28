import jwt from 'jsonwebtoken';
//import bcrypt from 'bcryptjs';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController{
    async store(req, res){
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if(!user){
            return res.status(401).json({message: 'O usuário não está cadastrado.'});
        }

        //const tester = bcrypt.compare(bcrypt.hash(password, 10) user.password_hash).then(
       //     valid => console.log(valid)
       // )
       // tester

        //console.log('Compare', tester)

        if(!(await user.checkPassword(password))){
            return res.status(400).json({ message: 'Senha incorreta.'});
        };

        const { id, name } = user;

        return res.json({
            user: {
                id, 
                name, 
                email
            },
            token: jwt.sign({ id, name, email }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        });
    }
}

export default new SessionController();