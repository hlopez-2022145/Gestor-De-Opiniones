import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import Category from './src/category/category.model.js'

// Función para crear una nueva categoría
async function createCategory() {
  try {
    // Verificar si la categoría "por defecto" ya existe en la base de datos
    let categoriaExistente = await Category.findOne({ nameCategory: 'otros' });

    // Si la categoría ya existe, imprime un mensaje y devuelve sin hacer nada más
    if (categoriaExistente) {
      return console.log('La categoría ya existe en la base de datos');
    }

    // Crea una nueva instancia de la categoría
    let nuevaCategoria = new Category({
      nameCategory: 'otros',
      description: 'Está categoría es por defecto',
    });

    // Guarda la categoría en la base de datos
    const categoriaGuardada = await nuevaCategoria.save()
    console.log('Categoría creada con éxito:', categoriaGuardada)
  } catch (err) {
    console.error('Error al crear la categoría:', err)
  }
}

initServer()
connect()
createCategory()