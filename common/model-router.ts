import { Router } from './router';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    
    constructor(protected model: mongoose.Model<D>) {
        super();
    }

    /**
     * estrategia para manipular a query nas classes filhas antes
     * de se inscrever, assim podemos customizar uma query antes
     * da inscricao
     * 
     * @param query 
     */
    protected prepareQueryAll(query: mongoose.DocumentQuery<D[],D>): mongoose.DocumentQuery<D[],D> {
        return query;
    }

    validateId = (req, resp, next) => {
        if (! mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError(`Objeto não encontrado com o ID ${req.params.id}`));
        } else {
            next();
        }
    }

    findAll = (req, resp, next) => {
        this.prepareQueryAll(this.model.find())   
            .then(this.renderAll(resp, next))
            .catch(next);
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .then(this.render(resp, next))
            .catch(next);
    }

    save = (req, resp, next) => {
        let document = new this.model(req.body);
        document.save()
        .then(this.render(resp, next))
        .catch(next);
    }

    /**
     * faz um overwrite completo, tirando os atributos
     * que nao foram passados: overwrite: true
     */
    replace = (req, resp, next) => {
        this.model.update({_id: req.params.id}, req.body, {
            overwrite: true, // substitui todo documento
            runValidators: true // executa as validacoes tambem no metodo update()
        }).exec().then(result => {
            // n => numero de linhas que foram alteradas
            if (result.n) {
                return this.model.findById(req.params.id);
            } else {
                throw new NotFoundError(`Objeto não encontrado de ID ${req.params.id}`);
                
            }
        }).then(this.render(resp, next))
        .catch(next);
    }

    /**
     * faz um overwrite parcial, os campos que 
     * nao forem passados serao mantidos:
     * findByIdAndUpdate()
     */
    update = (req, resp, next) => {
        this.model.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // obtem o novo documento e nao o antigo
            runValidators: true // executa as validacoes tambem no metodo update()
        })
        .then(this.render(resp, next))
        .catch(next);
    }

    delete = (req, resp, next) => {
        this.model.deleteOne({_id: req.params.id}).exec()
            .then((result: any) => {
                // n => numero de linhas que foram removidas
                if (result.n) {
                    resp.send(204);
                } else {
                    throw new NotFoundError(`Usuário não encontrado de ID ${req.params.id}`);

                }
                return next();
            })
            .catch(next);
    }
}