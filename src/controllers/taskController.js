import { getAlltask, createTask, getTaskById, updateTask , deleteTask, getTasksByUserId, getTaskByIdAndUserId, createTaskForUser } from "../models/taskModel.js";
import { v4 as uuidv4 } from "uuid";

//controladores de admin
export const listTask = async (req, res)=>{
    try {
        const tasks =await getAlltask();
        return res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({mesage: "Error al obtener tareas", error})
        
    }
};

export const searchTaskById = async (req, res) =>{
    try {
        const { id } = req.params; 
        if(!id) return res.status(400).json({mesage:"ID de tarea requerido"}) 

        const task = await getTaskById(id);
        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({mesage:"Error al buscar la tarea", error})
    }
}

export const addTask = async (req, res ) =>{
    try {
    const { title , description, completed } = req.body;
    if(!title || !description) return res.status(400).json({mesage:"Titulo y description requeridos"});
    const newTask = { id: uuidv4(), title, description, completed };
        await createTask(newTask);
        return res.status(201).json({mesage:"Tarea creada con exito", task: newTask});
    } catch (error) {
        res.status(500).json({mesage:"Error al crear la tarea", error})
    }
}

export const  patchTask = async (req, res) =>{
    try {
        const { id } = req.params; //requerir parametro por id
        const { title, description, completed } = req.body; //cuerpo del formulario
        if(!id) return res.status(400).json({mesage:"ID de tarea requerido"});// msj de error de faltante de id

        const existingTask = await getTaskById(id);
        if(!existingTask) return res.status(404).json({mesage:"Tarea no encontrada"});
//tarea inexistente
        const updatedTask = await updateTask(id, {title, description, completed });
        return res.status(200).json({mesage: "Tarea actualizada con exito", task: updatedTask});
    } catch (error) {
        return res.status(500).json({mesage:"Error al actualizar la tarea" ,error})
    }
}

export const destroyTask = async (req, res) =>{
    try {
        const { id } = req.params; //requerir parametro por id
        if(!id) return res.status(400).json({mesage:"ID de tarea requerido"});

        const existingTask = await getTaskById(id);
        if(!existingTask) return res.status(404).json({mesage:`Tarea no encontrada con ID ${id}`});
        
        await deleteTask(id);
        return res.status(200).json({mesage: "Tarea eliminada exitosamente", id});
        } catch (error) {
        return res.status(500).json({mesage:"Error al eliminar la tarea", error})
    }
}

//controlador de usuario
export const listUserTasks = async(req, res)=>{
    try {
        console.log("Usuario autenticado:", req.user);
        const userId = req.user.id;
        const tasks = await getTasksByUserId(userId);
        if(tasks.length === 0){
            return res.status(404).json({message: "No hay tareas para este usuario",
                tasks: []});
        }
        return res.status(200).json({
            message: "Tareas del usuario",
            tasks
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener las tareas del usuario",
            error: error.mesage || error
        })
    }
};
export const getOwnTaskById = async(req,res) =>{
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const task = await getTaskByIdAndUserId(taskId, userId);
        if(!task) return res.status(404).json({mesage:`Tarea no encontrada o no pertece al usuario`});
        return res.status(200).json({
            message: "Tarea encontrada",
            task
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la tarea",
            error: error.message || error
        })
    }
};

export const createOwnTask = async(req, res)=>{
    const {title, description} = req.body;
    const userId = req.user.id;

    try {
        if(!title || !description){
            return res.status(400).json({message: "Faltan campos obligatorios"})
        }
        const newTask = await createTaskForUser({
            title,
            description,
            user_id: userId
        });
        return res.status(201).json({
            message: "Tarea creada con exito",
            task: newTask
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la tarea",
            error: error.message || error
        })
    }
}

