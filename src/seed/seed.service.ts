import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';



@Injectable()
export class SeedService {

  constructor (
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){}


  async executeSeed(){
    await this.pokemonModel.deleteMany({})
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
//forma 2//
/*     const insertPromisesArray = []; */
    const pokemonToInsert :{name:string,no:number;}[]= [];

    data.results.forEach(async ({name,url}) => {
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2]
      pokemonToInsert.push({name,no})
      //Forma 1 de agregarlos todos a db no mas eficiente//
  /*     const pokemon = await this.pokemonModel.create({name,no}) */

  //Forma 2 de agregar a db mejor que forma 1//
/*   insertPromisesArray.push(
    this.pokemonModel.create({name,no})
  ) */

    })
    //forma2//
/*     await Promise.all(insertPromisesArray) */
    this.pokemonModel.insertMany(pokemonToInsert)
    return 'Seed executed'
  }


}
