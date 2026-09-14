# Recipe Generator

## Tujuan

Aplikasi menghasilkan maksimal tiga rekomendasi masakan Indonesia berdasarkan bahan yang dimiliki pengguna dan satu tujuan, misalnya `tinggi protein`, `healthy diet`, atau `tidak digoreng`.

API menyimpan permintaan dengan status `PENDING`, memasukkannya ke antrean BullMQ, lalu worker menghasilkan resep dan menyimpannya melalui Prisma sebelum mengubah status menjadi `COMPLETED`.

Input:

```json
{
  "ingredients": ["ayam", "tahu", "kecap"],
  "goal": "tinggi protein dan tidak digoreng"
}
```

## Schema Prisma

```prisma
model RecipeJob {
    id          String   @id @default(uuid())
    ingredients String[]
    goal        String
    status      String
    createdAt   DateTime @default(now())
}

model RecipeResult {
    id                          String   @id @default(uuid())
    name                        String
    description                 String
    ingredients                 String[]
    instructions                String[]
    estimatedCaloriesPerServing Int
    recipeJobId                 String
}
```

Satu `RecipeJob` dapat memiliki maksimal tiga `RecipeResult`. Nilai kalori merupakan estimasi per porsi.

## Endpoint

```text
POST /recipes     Membuat RecipeJob dan memasukkannya ke antrean
GET  /recipes     Mengambil semua RecipeJob
GET  /recipes/:id Mengambil recipeList berdasarkan RecipeJob.id
```
