const express = require('express');
const pool = require('./db');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Укажите домен вашего клиентского приложения
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ЕДИНИЦЫ ИЗМЕРЕНИЯ
app.get('/edinitsy-izmereniya', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM edinitsyizmereniya');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/edinitsy-izmereniya', async (req, res) => {
    try {
        const { naimenovanie } = req.body;
        const newUnit = await pool.query(
            'INSERT INTO EdinitsyIzmereniya (naimenovanie) VALUES($1) RETURNING *',
            [naimenovanie]
        );
        res.json(newUnit.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/edinitsy-izmereniya/:id', async (req, res) => {
    const id = req.params.id; // Получаем ID записи для удаления из URL

    try {
        // Выполняем SQL-запрос на удаление записи по указанному ID
        const deleteQuery = 'DELETE FROM EdinitsyIzmereniya WHERE ID = $1';
        const result = await pool.query(deleteQuery, [id]);

        // Проверяем, была ли удалена запись
        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

// Обновление записи в таблице EdinitsyIzmereniya
app.put('/edinitsy-izmereniya/:id', async (req, res) => {
    const id = req.params.id; // Получаем ID записи для обновления из URL
    const { naimenovanie } = req.body; // Получаем новое значение из тела запроса

    try {
        // Выполняем SQL-запрос на обновление записи по указанному ID
        const updateQuery = 'UPDATE EdinitsyIzmereniya SET naimenovanie = $1 WHERE ID = $2';
        const result = await pool.query(updateQuery, [naimenovanie, id]);

        // Проверяем, была ли обновлена запись
        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно обновлена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});


// ЕДИНИЦЫ ИЗМЕРЕНИЯ

//SYRIE

app.get('/syrie', async (req, res) => {
    try {
        const query = `SELECT Syrie.id, Syrie.naimenovanie, Syrie.kolichestvo, EdinitsyIzmereniya.naimenovanie AS EdinitsyIzmereniya, Syrie.summa 
        FROM Syrie 
        JOIN EdinitsyIzmereniya ON Syrie.edinitsa_izmereniya_id = EdinitsyIzmereniya.id;
        `;
        const result = await pool.query(query);

        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/syrie', async (req, res) => {
    const { naimenovanie, izmereniya, kolichestvo, summa } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Syrie (naimenovanie, edinitsa_izmereniya_id, kolichestvo, summa) VALUES ($1, $2, $3, $4) RETURNING *',
            [naimenovanie, izmereniya, kolichestvo, summa]
        );
        res.status(201).json(result.rows[0]); // Отправляем созданную запись в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/syrie/:id', async (req, res) => {
    const id = req.params.id;
    const { naimenovanie, izmereniya, kolichestvo, summa } = req.body;

    try {
        const updateQuery = 'UPDATE Syrie SET naimenovanie = $1, edinitsa_izmereniya_id = $2, kolichestvo = $3, summa = $4 WHERE ID = $5 RETURNING *';
        const result = await pool.query(updateQuery, [naimenovanie, izmereniya, kolichestvo, summa, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/syrie/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM Syrie WHERE ID = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

//SYRIE


//GOTOV PRODUCT

app.get('/GotovayaProduktsiya', async (req, res) => {
    try {
        const query = `SELECT GotovayaProduktsiya.id, GotovayaProduktsiya.naimenovanie, GotovayaProduktsiya.kolichestvo, EdinitsyIzmereniya.naimenovanie AS EdinitsyIzmereniya, GotovayaProduktsiya.summa 
        FROM GotovayaProduktsiya 
        JOIN EdinitsyIzmereniya ON GotovayaProduktsiya.edinitsa_izmereniya_id = EdinitsyIzmereniya.id;
        `;
        const result = await pool.query(query);

        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/GotovayaProduktsiya', async (req, res) => {
    const { naimenovanie, izmereniya, kolichestvo, summa } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO gotovayaproduktsiya (naimenovanie, edinitsa_izmereniya_id, kolichestvo, summa) VALUES ($1, $2, $3, $4) RETURNING *',
            [naimenovanie, izmereniya, kolichestvo, summa]
        );
        res.status(201).json(result.rows[0]); // Отправляем созданную запись в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/GotovayaProduktsiya/:id', async (req, res) => {
    const id = req.params.id;
    const { naimenovanie, izmereniya, kolichestvo, summa } = req.body;

    try {
        const updateQuery = 'UPDATE gotovayaproduktsiya SET naimenovanie = $1, edinitsa_izmereniya_id = $2, kolichestvo = $3, summa = $4 WHERE ID = $5 RETURNING *';
        const result = await pool.query(updateQuery, [naimenovanie, izmereniya, kolichestvo, summa, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/GotovayaProduktsiya/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM GotovayaProduktsiya WHERE ID = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

//GOTOV PRODUCT

//DOLJNOSTI

app.get('/Dolzhnosti', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dolzhnosti');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/Dolzhnosti', async (req, res) => {
    try {
        const { dolzhnost } = req.body;
        const newUnit = await pool.query(
            'INSERT INTO dolzhnosti (dolzhnost) VALUES($1) RETURNING *',
            [dolzhnost]
        );
        res.json(newUnit.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/Dolzhnosti/:id', async (req, res) => {
    const id = req.params.id; // Получаем ID записи для удаления из URL

    try {
        // Выполняем SQL-запрос на удаление записи по указанному ID
        const deleteQuery = 'DELETE FROM dolzhnosti WHERE ID = $1';
        const result = await pool.query(deleteQuery, [id]);

        // Проверяем, была ли удалена запись
        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

// Обновление записи в таблице EdinitsyIzmereniya
app.put('/Dolzhnosti/:id', async (req, res) => {
    const id = req.params.id; // Получаем ID записи для обновления из URL
    const { dolzhnost } = req.body; // Получаем новое значение из тела запроса

    try {
        // Выполняем SQL-запрос на обновление записи по указанному ID
        const updateQuery = 'UPDATE Dolzhnosti SET dolzhnost = $1 WHERE ID = $2';
        const result = await pool.query(updateQuery, [dolzhnost, id]);

        // Проверяем, была ли обновлена запись
        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно обновлена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});


//DOLJNOSTI

//SOTRUDNIKI

app.get('/Sotrudniki', async (req, res) => {
    try {
        const query = `SELECT Sotrudniki.id, Sotrudniki.fio, dolzhnosti.dolzhnost AS dolzhnosti, Sotrudniki.oklad, Sotrudniki.adres, Sotrudniki.telefon
        FROM Sotrudniki 
        JOIN dolzhnosti ON Sotrudniki.dolzhnost_id = dolzhnosti.id;
        `;
        const result = await pool.query(query);

        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/Sotrudniki', async (req, res) => {
    const { fio, dolzhnost, oklad, adres, telefon } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Sotrudniki (fio, dolzhnost_id, oklad, adres, telefon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [fio, dolzhnost, oklad, adres, telefon]
        );
        res.status(201).json(result.rows[0]); // Отправляем созданную запись в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/Sotrudniki/:id', async (req, res) => {
    const id = req.params.id;
    const { fio, dolzhnost, oklad, adres, telefon } = req.body;

    try {
        const updateQuery = 'UPDATE Sotrudniki SET fio = $1, dolzhnost_id = $2, oklad = $3, adres = $4, telefon = $5 WHERE ID = $6 RETURNING *';
        const result = await pool.query(updateQuery, [fio, dolzhnost, oklad, adres, telefon, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/Sotrudniki/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM Sotrudniki WHERE ID = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});


//SOTRUDNIKI

//INGREDIENTY

app.get('/Ingredienty', async (req, res) => {
    try {
        const query = `
    SELECT 
        Ingredienty.id, 
        Ingredienty.kolichestvo,
        GotovayaProduktsiya.naimenovanie AS GotovayaProduktsiya, 
        Syrie.naimenovanie AS Syrie
    FROM 
        Ingredienty 
    JOIN 
        GotovayaProduktsiya ON Ingredienty.produktsiya_id = GotovayaProduktsiya.id
    JOIN 
        Syrie ON Ingredienty.syrie_id = Syrie.id;
        `

            ;
        const result = await pool.query(query);

        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/Ingredienty', async (req, res) => {
    const { product, prodSyr, kolichestvo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Ingredienty (produktsiya_id, syrie_id, kolichestvo) VALUES ($1, $2, $3) RETURNING *',
            [product, prodSyr, kolichestvo]
        );
        res.status(201).json(result.rows[0]); // Отправляем созданную запись в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/Ingredienty/:id', async (req, res) => {
    const id = req.params.id;
    const { product, prodSyr, kolichestvo } = req.body;

    try {
        const updateQuery = 'UPDATE Ingredienty SET produktsiya_id = $1, syrie_id = $2, kolichestvo = $3 WHERE ID = $4 RETURNING *';
        const result = await pool.query(updateQuery, [product, prodSyr, kolichestvo, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/Ingredienty/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM Ingredienty WHERE ID = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

//INGREDIENTY

//BYUDZHET

app.get('/byudzhet', async (req, res) => {
    try {
        const query =
            `SELECT * FROM 
        byudzhet;`
        const result = await pool.query(query);
        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/byudzhet/:id', async (req, res) => {
    const id = req.params.id;
    const { byudzhet } = req.body;
    // byudzhet
    try {
        const updateQuery = 'UPDATE byudzhet SET summa_byudzheta = $1 WHERE ID = $2 RETURNING *';
        const result = await pool.query(updateQuery, [byudzhet, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

//BYUDZHET

//ЗАКУПКАСЫРЬЯ

app.get('/ZakupkaSyrja', async (req, res) => {
    try {
        const query =

            `
    SELECT 
        ZakupkaSyrja.id, 
        Syrie.naimenovanie AS syrie_naimenovanie, 
        ZakupkaSyrja.kolichestvo, 
        ZakupkaSyrja.summa, 
        ZakupkaSyrja.data, 
        Sotrudniki.fio AS sotrudnik_fio
    FROM 
        ZakupkaSyrja
    JOIN
        Syrie ON ZakupkaSyrja.syrie_id = Syrie.id
    JOIN
        Sotrudniki ON ZakupkaSyrja.sotrudnik_id = Sotrudniki.id;
    `
        const result = await pool.query(query);
        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/ZakupkaSyrja', async (req, res) => {
    const { syr, kolichestvo, summa, dataa, sotrud } = req.body;
    console.log(req.body)
    try {
        const result = await pool.query(
            'INSERT INTO ZakupkaSyrja (syrie_id, kolichestvo, summa, data, sotrudnik_id) VALUES ($1, $2, $3, $4 ,$5) RETURNING *',
            [syr, kolichestvo, summa, dataa, sotrud]
        );
        res.status(201).json(result.rows[0]); // Отправляем созданную запись в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/ZakupkaSyrja/:id', async (req, res) => {
    const id = req.params.id;
    const { byudzhet } = req.body;

    try {
        const updateQuery = 'UPDATE ZakupkaSyrja SET summa_byudzheta = $1 WHERE ID = $2 RETURNING *';
        const result = await pool.query(updateQuery, [byudzhet, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/ZakupkaSyrja/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM ZakupkaSyrja WHERE ID = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

//ЗАКУПКАСЫРЬЯ

//ПРОДАЖА ПРОДУКЦИИ
app.get('/Prodazhaproduktsii', async (req, res) => {
    try {
        const query =
            `
    SELECT 
        Prodazhaproduktsii.id, 
        gotovayaproduktsiya.naimenovanie AS syrie_naimenovanie, 
        Prodazhaproduktsii.kolichestvo, 
        Prodazhaproduktsii.summa, 
        Prodazhaproduktsii.data, 
        Sotrudniki.fio AS sotrudnik_fio
    FROM 
        Prodazhaproduktsii
    JOIN
        gotovayaproduktsiya ON Prodazhaproduktsii.produktsiya_id = gotovayaproduktsiya.id
    JOIN
        Sotrudniki ON Prodazhaproduktsii.sotrudnik_id = Sotrudniki.id;
    `
        const result = await pool.query(query);
        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/Prodazhaproduktsii', async (req, res) => {
    const { gotovProduct, kolichestvo, summa, dataa, sotrud } = req.body;
    console.log(req.body)
    try {
        const result = await pool.query(
            'INSERT INTO Prodazhaproduktsii (produktsiya_id, kolichestvo, summa, data, sotrudnik_id) VALUES ($1, $2, $3, $4 ,$5) RETURNING *',
            [gotovProduct, kolichestvo, summa, dataa, sotrud]
        );
        res.status(201).json(result.rows[0]); // Отправляем созданную запись в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/Prodazhaproduktsii/:id', async (req, res) => {
    const id = req.params.id;
    const { gotovProduct, kolichestvo, summa, dataa, sotrud } = req.body;

    try {
        const updateQuery = 'UPDATE Prodazhaproduktsii SET produktsiya_id = $1, kolichestvo = $2, summa = $3, data = $4, sotrudnik_id = $5 WHERE ID = $6 RETURNING *';
        const result = await pool.query(updateQuery, [gotovProduct, kolichestvo, summa, dataa, sotrud, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/Prodazhaproduktsii/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM Prodazhaproduktsii WHERE ID = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

//ПРОДАЖА ПРОДУКЦИИ

//ПРОИЗВОДСТВО ПРОДУКЦИИ
app.get('/proizvodstvoproduktsii', async (req, res) => {
    try {
        const query =
            `
    SELECT 
        proizvodstvoproduktsii.id, 
        gotovayaproduktsiya.naimenovanie AS naimenovanie, 
        proizvodstvoproduktsii.kolichestvo, 
        proizvodstvoproduktsii.data, 
        Sotrudniki.fio AS sotrudnik_fio
    FROM 
        proizvodstvoproduktsii
    JOIN
        gotovayaproduktsiya ON proizvodstvoproduktsii.produktsiya_id = gotovayaproduktsiya.id
    JOIN
        Sotrudniki ON proizvodstvoproduktsii.sotrudnik_id = Sotrudniki.id;
    `
        const result = await pool.query(query);
        res.json(result.rows); // Отправляем результат в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.post('/proizvodstvoproduktsii', async (req, res) => {
    const { gotovProduct, kolichestvo, dataa, sotrud } = req.body;
    console.log(req.body)
    try {
        const result = await pool.query(
            'INSERT INTO proizvodstvoproduktsii (produktsiya_id, kolichestvo, data, sotrudnik_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [gotovProduct, kolichestvo, dataa, sotrud]
        );
        res.status(201).json(result.rows[0]); // Отправляем созданную запись в формате JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});


app.put('/proizvodstvoproduktsii/:id', async (req, res) => {
    const id = req.params.id;
    const { gotovProduct, kolichestvo, dataa, sotrud } = req.body;

    try {
        const updateQuery = 'UPDATE proizvodstvoproduktsii SET produktsiya_id = $1, kolichestvo = $2, data = $3, sotrudnik_id = $4  WHERE ID = $5 RETURNING *';
        const result = await pool.query(updateQuery, [gotovProduct, kolichestvo, dataa, sotrud, id]);

        if (result.rowCount === 1) {
            res.json(result.rows[0]); // Отправляем обновлённую запись в формате JSON
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

app.delete('/proizvodstvoproduktsii/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteQuery = 'DELETE FROM proizvodstvoproduktsii WHERE ID = $1 RETURNING *';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 1) {
            res.send(`Запись с ID ${id} успешно удалена`);
        } else {
            res.status(404).send(`Запись с ID ${id} не найдена`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
})
//ПРОИЗВОДСТВО ПРОДУКЦИИ


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
