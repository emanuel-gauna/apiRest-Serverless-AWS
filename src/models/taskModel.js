import db from "../db/rds.js";

export const getAlltask = async (task)=>{
    const [rows] = await db.query("SELECT * FROM tasks");
    return rows;
}

export const getTaskById = async(id) =>{
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ? ", [id]);
        return rows[0];
};


export const createTask = async(task) =>{
    const { title, description, completed } = task ;
    const result = await db.query("INSERT INTO tasks (title, description, completed) VALUES(?, ?, ?)", [title, description, completed]);
    return {message: "Task created successfully", id: result.insertId, ...task};
};

export const updateTask = async(id, task) =>{
    const { title, description, completed } = task ;
    await db.query("UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?" , [ title, description, completed, id]
    );
    return { id, ...task };
};

export const deleteTask = async(id) =>{
    await db.query("DELETE FROM tasks WHERE id = ?" , [id]);
    return {message: "Task deleted successfully"};
}

