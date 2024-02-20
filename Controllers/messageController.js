import Message from "../Models/Message.js";

const newMessage = async (req, res )=>{

    const message = new Message (req.body)

    try {
        await message.save()
        return res.json({ msg: 'Mensaje creado'})
  } catch  {
        return  res.status(404).json({ error: 'Error al crear el mensaje' });
  }

}



const updateMessage = async (req, res) =>{

const {id} = req.params

const {message} = req.body

const findMessage = await Message.findById(id);

if (!findMessage) {
    return res.status(400).json({ msg: 'ID de mensaje no válido' });
}

try {
    
    findMessage.message = message
    await findMessage.save()
    return res.json({ msg: 'Mensaje actualizado'})
} catch (error) {
    return res.status(404).json({ error: 'Error al actualizar el mensaje' });
}


}


const deleteMessage = async (req, res) => {

    const {id} = req.params

    const message = await Message.findById(id)

    if (!message) {
        return res.status(400).json({ msg: 'ID de mensaje no válido' });
    }

    try {
        message.deleteOne()
        return res.json({ msg: 'Mensaje ha sido eliminado'})
    } catch (error) {
        return res.status(404).json({ error: 'Error al eliminar el mensaje' });
    }


}

// Función para obtener la vista de chat
 const getChatView = (req, res) => {
    res.render('chat'); // 'chat' debe coincidir con el nombre de tu archivo de vista Handlebars
};



export{
    newMessage,
    updateMessage,
    deleteMessage,
    getChatView
}