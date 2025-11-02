import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-public-products',
  templateUrl: './public-products.component.html',
  styleUrls: ['./public-products.component.css']
})
export class PublicProductsComponent implements OnInit {
  products: Product[] = [];
  constructor(private ps: ProductService) {}
  ngOnInit() {
    this.ps.getProducts().subscribe(list => this.products = list);
  }

}
