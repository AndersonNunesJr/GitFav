import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
   
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
    console.log("ads",this.entries)

    if(this.entries.length === 0){
      let action = "add"
      this.waitList(action);
    }
  }
  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username);
      if (userExists) {
        throw new Error("Usuário já cadastrado");
      }
      const user = await GithubUser.search(username);
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onAdd();
  }
  onAdd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }
  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector( ".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user a").href =`https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").addEventListener("click", () => {
        const isOk = confirm("Deseja realmente deletar dos favoritos?");
        if (isOk) {
          this.delete(user);
          if(this.entries.length === 0){
            let action = "add";
            this.waitList(action);
          }
        }
      });
      this.tbody.append(row);

      if(this.entries.length !== 0){
        let action = "remove";
        this.waitList(action);
      }
    });
  }
  createRow() {
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/AndersonNunesJr.png" alt="" />
      <a href="https://github.com/AndersonNunesJr" target="_blank">
        <p>Anderson nunes</p>
        <span>AndersonNunesJr</span>
      </a>
    </td>
    <td class="repositories">1</td>
    <td class="followers">15</td>
    <td class="btnRemove">
      <button class="remove">Delete</button>
    </td>
    `;
    return tr;
  }
  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
  waitList(action){
    if(action == "remove"){
    this.root.querySelector(".starWait").classList.add("hide");
  }
  if(action !== "remove"){
    this.root.querySelector(".starWait").classList.remove("hide");
  }
}
}

