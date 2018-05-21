import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { CartItem } from "../../models/cart-item";
import { ProdutoDTO } from "../../models/produto.dto";
import { ItemPedidoDTO } from "../../models/item-pedido.dto";
import { RefDTO } from "../../models/ref.dto";

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

    removeProduto(produto: ProdutoDTO): Cart {
        if (!produto) {
            return;
        }

        let cart: Cart = this.getCart();

        let prodIndex = cart.items.findIndex(i => i.produto.id == produto.id);

        if (prodIndex != -1) {
            cart.items.splice(prodIndex, 1);
            this.storage.setCart(cart);
        }

        return cart;
    }

    increaseQuantity(produto: ProdutoDTO): Cart {
        if (!produto) {
            return;
        }

        let cart: Cart = this.getCart();

        let prodIndex = cart.items.findIndex(i => i.produto.id == produto.id);

        if (prodIndex != -1) {
            cart.items[prodIndex].quantidade++;
            this.storage.setCart(cart);
        }

        return cart;

    }

    decreaseQuantity(produto: ProdutoDTO): Cart {
        if (!produto) {
            return;
        }

        let cart: Cart = this.getCart();

        let prodIndex = cart.items.findIndex(i => i.produto.id == produto.id);

        if (prodIndex != -1) {
            cart.items[prodIndex].quantidade--;
        }

        if (cart.items[prodIndex].quantidade < 1) {
            cart = this.removeProduto(produto);
        }

        this.storage.setCart(cart);

        return cart;

    }

    cartItemsToItemPedido(): ItemPedidoDTO[] {
        let cart: Cart = this.getCart();
        let itensPedido: ItemPedidoDTO[] = [];

        itensPedido = cart.items.map(i => {return {quantidade: i.quantidade, produto: {id: i.produto.id}}});
        
        return itensPedido;
    }

    total(): number {
        let cart: Cart = this.getCart();
        let total: number = 0;

        cart.items.forEach(i => {
            total += i.quantidade * i.produto.preco;
        });

        return total;
    }

}