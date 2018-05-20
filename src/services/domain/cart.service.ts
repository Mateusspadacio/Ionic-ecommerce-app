import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { CartItem } from "../../models/cart-item";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class CartService {

    constructor(public storage: StorageService){}

    createOrClearCart(): Cart {
        let cart: Cart = {items: []};
        this.storage.setCart(cart);
        return cart;
    }

    getCart(): Cart {
        let cart: Cart = this.storage.getCart();
        console.log(cart)
        if (cart == null) {
            cart = this.createOrClearCart();
        }

        return cart;
    }

    addProduto(produto: ProdutoDTO): Cart {
        if (!produto) {
            return;
        }

        let cart: Cart = this.getCart();

        let prod = cart.items.find( i => i.produto.id == produto.id);

        if (prod) {
            prod.quantidade += 1;
        } else {
            prod = {quantidade: 1, produto: produto};
            cart.items.push(prod);
        }

        this.storage.setCart(cart);
        return cart;
    }

}