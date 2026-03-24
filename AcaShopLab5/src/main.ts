import { createClient } from '@supabase/supabase-js'

/**
 * CONFIGURACIÓN INICIAL
 */
const API_URL: string = "https://jsonplaceholder.typicode.com"; 
const POST_ID_TO_SEARCH: number = 1; 
const IS_DEBUG_MODE: boolean = true; 

// Configuración Supabase
const SUPABASE_URL: string = "https://xguzyrtshhhrmpattmkv.supabase.co";
const SUPABASE_KEY: string = "sb_publishable_-tGQ8-iLo5GhvugUKs22wA_CMDloy6v";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * INTERFACES
 */
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface Venta {
  idventa?: number;
  cantidad: number;
  precio_unitario: number;
  total: number;
  estado: string;
}

/**
 * FUNCIONES DE PRUEBA (API EXTERNA)
 */
const fetchSinglePost = async (id: number): Promise<void> => {
  if (IS_DEBUG_MODE) console.log(`%c [LAB 1] Buscando post: ${id}`, "color: cyan; font-weight: bold;");
  try {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data: Post = await response.json();
    console.log("✅ Post recuperado:", data.title);
  } catch (error) {
    console.error("❌ Fallo en Lab 1:", error);
  }
};

const createNewPost = async (): Promise<void> => {
  console.log("%c [LAB 2] Creando nuevo recurso...", "color: orange; font-weight: bold;");
  const myNewPost = { title: "Prueba TS", body: "Contenido de lab", userId: 10 };
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      body: JSON.stringify(myNewPost),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    const createdPost: Post = await response.json();
    console.log("✅ Recurso creado:", createdPost);
  } catch (error) {
    console.error("❌ Fallo en Lab 2:", error);
  }
};

const fetchCommentsByPost = async (postId: number): Promise<void> => {
  console.log(`%c [RETO] Buscando comentarios del post: ${postId}`, "color: #f39c12; font-weight: bold;");
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);
    if (!response.ok) throw new Error("Error en comentarios");
    const data: Comment[] = await response.json();
    console.log(`✅ Se encontraron ${data.length} comentarios.`);
    data.forEach(comment => console.log(`   - Autor: ${comment.email}`));
  } catch (error) {
    console.error("❌ Error en el Reto:", error);
  }
};

/**
 * FUNCIONES DE BASE DE DATOS (SUPABASE)
 */
const obtenerVentas = async (): Promise<void> => {
  console.log("%c [SUPABASE] Consultando tabla 'venta'...", "color: #3ecf8e; font-weight: bold;");
  const { data, error } = await supabase.from('venta').select('*');

  if (error) {
    console.error("❌ Error en Supabase:", error.message);
    return;
  }

  const listaVentas: Venta[] = data as Venta[];
  console.log("✅ Datos de la tabla 'venta' recibidos:");
  console.table(listaVentas); 
};

/**
 * ORQUESTADOR FINAL
 */
const runLaboratory = async () => {
  console.log("%c --- INICIO DEL EXPERIMENTO ---", "background: #222; color: #bada55; padding: 5px;");
  
  // Ejecución en orden
  await fetchSinglePost(POST_ID_TO_SEARCH); 
  await createNewPost(); 
  await fetchCommentsByPost(POST_ID_TO_SEARCH); 
  await obtenerVentas(); 
  
  console.log("%c --- EXPERIMENTO FINALIZADO ---", "background: #222; color: #bada55; padding: 5px;");
};

runLaboratory();