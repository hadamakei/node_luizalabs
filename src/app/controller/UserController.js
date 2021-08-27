import User from '../models/User'

class UserController{
    async store(req, res){
        const {id,name, email } = await User.create(req.body);
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
        return res.status(200).json({message: 'isso ai psiti'});
    };
}

export default new UserController();