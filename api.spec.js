import { test, expect } from '@playwright/test';

const BASE_URL = 'https://reqres.in';
const API_KEY = 'pub_95f24de33f734d75f5f436317587e62e';

// 🔹 Reusable headers
const headers = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
};

test.describe('ReqRes API Automation Suite', () => {

    test('End-to-End API Flow (POST → GET → PUT)', async ({ request }) => {

        // 🔹 1. CREATE USER
        const createRes = await request.post(`${BASE_URL}/api/users`, {
            headers,
            data: {
                name: "Sreeman",
                job: "QA Engineer"
            }
        });

        expect(createRes.status()).toBe(201);

        const createBody = await createRes.json();

        // ✅ Validations
        expect(createBody).toHaveProperty('name', 'Sreeman');
        expect(createBody).toHaveProperty('job', 'QA Engineer');
        expect(createBody).toHaveProperty('id');
        expect(createBody).toHaveProperty('createdAt');

        console.log('Created User:', createBody);

        // ❗ ReqRes limitation → using static ID
        const userId = 2;

        // 🔹 2. GET USER
        const getRes = await request.get(`${BASE_URL}/api/users/${userId}`, {
            headers
        });

        expect(getRes.status()).toBe(200);

        const getBody = await getRes.json();

        expect(getBody.data).toMatchObject({ id: 2 });
        expect(getBody.data).toHaveProperty('email');
        expect(getBody.data).toHaveProperty('first_name');

        console.log('Fetched User:', getBody.data);

        // 🔹 3. UPDATE USER
        const updateRes = await request.put(`${BASE_URL}/api/users/${userId}`, {
            headers,
            data: {
                name: "Sreeman Updated",
                job: "Senior QA"
            }
        });

        expect(updateRes.status()).toBe(200);

        const updateBody = await updateRes.json();

        expect(updateBody).toMatchObject({
            name: "Sreeman Updated",
            job: "Senior QA"
        });

        expect(updateBody).toHaveProperty('updatedAt');

        console.log('✅ Updated User:', updateBody);
    });


    // 🔥 Negative Test
    test('Get invalid user should return 404', async ({ request }) => {

        const res = await request.get(`${BASE_URL}/api/users/9999`, {
            headers
        });

        expect(res.status()).toBe(404);

        console.log('Negative test passed');
    });

});