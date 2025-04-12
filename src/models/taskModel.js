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

//obtener tareas solo del mismo usuario
export const getTasksByUserId = async(userId) =>{
    const [rows] = await db.query("SELECT * FROM tasks WHERE user_id = ?", [userId]);
    return rows; //retorna todo
}
//obtener una tarea especifica del usuario
export const getTaskByIdAndUserId = async(taskId, userId) =>{
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
        return rows[0]; //retorna solo una tarea
}

export const createTaskForUser = async (taskData) => {
    const { title, description, user_id } = taskData;
    const [result] = await db.query(
        "INSERT INTO tasks (title, description, user_id, completed) VALUES (?, ?, ?, ?)",
        [title, description, user_id, false]
    );

    return {
        id: result.insertId,
        title,
        description,
        completed: false,
    };
};
