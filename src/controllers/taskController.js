import { getAlltask, createTask, getTaskById, updateTask , deleteTask } from "../models/taskModel.js";
import { v4 as uuidv4 } from "uuid";

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

