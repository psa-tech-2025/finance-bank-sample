import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
   products: Product[] = [];
  loading = false;

  constructor(private ps: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.ps.getProducts().subscribe(list => this.products = list);
  }

  editProduct(p: Product) {
    this.router.navigate(['/admin/products/edit', p.id]);
  }

  async deleteProduct(p: Product) {
    if (!confirm('Delete this product?')) return;
    this.loading = true;
    try {
      await this.ps.deleteProduct(p.id!);
      alert('Deleted');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      this.loading = false;
    }
  }

}
