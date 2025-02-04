// import faiss from "faiss-node";

// const dimension = 384; // Размерность векторов
// const index = new faiss.IndexFlatL2(dimension);
// const idMap = new Map<number, number>(); // Храним соответствие индексов FAISS и ID товаров

// export const addToIndex = (id: number, vector: number[]) => {
//   const vectorArray = new Float32Array(vector); // Преобразуем в Float32Array

//   const currentIndex = index.ntotal(); // Вызываем метод ntotal()
//   idMap.set(currentIndex, id);

//   index.add(new Float32Array(vectorArray).buffer as any); // Исправлено: передаем ArrayBuffer
// };

// export const searchIndex = (queryVector: number[], topK: number): number[] => {
//   const queryArray = new Float32Array(queryVector);
//   const results = index.search(
//     new Float32Array(queryArray).buffer as any,
//     topK
//   ); // Исправлено

//   return Array.from(results.labels) // Преобразуем в обычный массив
//     .map((label) => idMap.get(label) || -1)
//     .filter((id) => id !== -1);
// };
