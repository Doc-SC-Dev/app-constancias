/**
 * Script de soporte para identificar potenciales cuellos de botella 
 * en el tamaño del bundle de Next.js.
 */
const fs = require('fs');
const path = require('path');

function checkFileHeuristics(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory() && !fullPath.includes('node_modules')) {
            checkFileHeuristics(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Heurística: Importaciones pesadas en componentes de cliente
            if (content.includes("'use client'") && content.includes("from 'lucide-react'")) {
                console.log(`[WARN] ${file}: Considera importar iconos individuales para reducir bundle.`);
            }
            
            // Heurística: Falta de dynamic imports en componentes grandes
            if (content.length > 10000 && !content.includes('next/dynamic')) {
                console.log(`[SUGGEST] ${file}: Componente grande detectado. ¿Podría usarse dynamic import?`);
            }
        }
    });
}

// Ejecución básica en la raíz del proyecto o carpeta src
const startPath = fs.existsSync('./src') ? './src' : './app';
console.log(`--- Analizando ruta: ${startPath} ---`);
checkFileHeuristics(startPath);