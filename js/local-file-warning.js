// Classic script so the local-file warning works even when ES modules cannot load.
if (location.protocol === "file:") {
    document.getElementById("save-status").textContent = "Abra a ficha por um servidor local.";
    document.getElementById("save-detail").textContent = "Na pasta do projeto, execute python3 -m http.server 8000 e acesse http://localhost:8000. Módulos JavaScript não carregam corretamente ao abrir o HTML diretamente.";
}
