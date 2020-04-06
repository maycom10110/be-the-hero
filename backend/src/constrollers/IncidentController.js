const connection = require('./../database/connection');

module.exports = {
    
    async index(request, response){         //retorna todos os incidents, de 5 em 5
        const {page=1} = request.query;

        const [count] = await connection('incidents').count();  //contará o numero de incidents

        const incidents = await connection('incidents')
            .join('ongs','ongs.id', '=', 'incidents.ong_id')         //busca dados em outra tabela que é referenciada pelo primeiro parametro
            .limit(5)                   //antes do offset para carregar os 5 e depois aplicar a regra de recarregamento
            .offset((page-1)*5)         //na 1º = 0, 2º = 5 e carregara a partir do 5 registro na proxima chamada, 3º = 10 carregara a partir do 10 registro na proxima chamada
            .select(['incidents.*', 'ongs.email', 'ongs.name', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);  //seleciono o que que quero de cada uma das tabelas       

        response.header('X-Total-Count', count['count(*)']);       //retornara pelo cabesalho da requisição, utilizado normalmente para paginação

        return response.json(incidents);
    },

    async create(request, response){
        const { value, description, title} = request.body;
        const ong_id = request.headers.authorization;

    const [id] = await connection('incidents').insert({        //devido ao tample increments n0 20200303153156_create_incidents.js ao adcionar um novo elemento na tabela ele retorna um valor que é incrementado cada vez que é adicionado um novo incident(sendo esse valor utilizado como id pela por mim na aplicação) 
            value,                                              //[id] faço essa desusutruturação para pegar o id gerado como foi explicado acima 
            description,                                        //pois ele retorna um array com que na primeira possição contem o id, sendo assim acesso essa possição e guardo essse valor na variavel id
            title, 
            ong_id
        });

        return response.json({id});
    },

    async delete(request, response){
        const {id} = request.params;
        const ong_id =request.headers.authorization;

        const incidents = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if(incidents.ong_id != ong_id)
            return response.status(401).json({ erro: 'operation not permitted'});
        
        await connection('incidents').where('id', id).delete();
        return response.status(204).send();
    }
}