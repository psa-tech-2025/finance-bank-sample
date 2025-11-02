import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-admin-product-form',
  templateUrl: './admin-product-form.component.html',
  styleUrls: ['./admin-product-form.component.css']
})
export class AdminProductFormComponent implements OnInit {
 isEdit = false;
  id?: string;
  product: Partial<Product> = { name: '', description: '', price: 0, productId: '' };
  file?: File;
  uploadProgress = 0;
  private sub?: Subscription;

  constructor(private ps: ProductService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.isEdit = true;
      this.sub = this.ps.getProductById(this.id).subscribe(p => {
        if (p) this.product = p;
      });
    }
  }

  onFileChange(e: any) {
    if (e.target.files && e.target.files.length) {
      this.file = e.target.files[0];
    }
  }

  save() {
    if (this.isEdit && this.id) {
      this.ps.updateProduct(this.id, this.product, this.file).subscribe(() => {
        alert('Updated');
        this.router.navigate(['/admin/products']);
      }, err => {
        console.error(err);
        alert('Update failed');
      });
    } else {
      this.ps.addProduct(this.product, this.file).subscribe(() => {
        alert('Created');
        this.router.navigate(['/admin/products']);
      }, err => {
        console.error(err);
        alert('Create failed');
      });
    }
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}


