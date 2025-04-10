// tests/users.test.js
import request from 'supertest';
import app from '../app.js'; // asegurate de exportar correctamente tu app en app.js
import db from "../db/rds.js";

// Simulamos un token admin válido (ajustalo según tu JWT real)
const adminToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJlbWFAYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjQzMDQ5LCJleHAiOjE3NDQyNDY2NDl9.3Pz2KTDW0soovAxdrB07cXbptddVKpYwnhzFAlN3lkQ";

describe("GET /users/role/:role", () => {
  it("debería devolver usuarios con el rol 'admin'", async () => {
    const res = await request(app)
      .get("/users/role/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeInstanceOf(Array);
    res.body.user.forEach(user => {
      expect(user.role).toBe("admin");
    });
  });

  it("debería rechazar un rol inválido como 'guest'", async () => {
    const res = await request(app)
      .get("/users/role/guest")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400); // o 404, según cómo manejes errores
    expect(res.body.message).toMatch(/no es válido/i);
  });
});
afterAll(async () => {
    await db.end(); // Cierra el pool de conexiones
  });
