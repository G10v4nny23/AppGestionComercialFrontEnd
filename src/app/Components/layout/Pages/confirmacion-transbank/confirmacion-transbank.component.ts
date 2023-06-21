import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransbankConfirm } from 'src/app/Interfaces/transbank-confirm';
import { TransbankService } from 'src/app/Services/transbank.service';

@Component({
  selector: 'app-confirmacion-transbank',
  templateUrl: './confirmacion-transbank.component.html',
  styleUrls: ['./confirmacion-transbank.component.css'],
})
export class ConfirmacionTransbankComponent implements OnInit {

  transbankConfirm: TransbankConfirm;


  constructor(
    private ARouter: ActivatedRoute,
    private transbankService: TransbankService
  ) {}

  ngOnInit(): void {
    const token = this.ARouter.snapshot.queryParams["token_ws"]
    this.transbankService.confirmarTransaccion(token).subscribe(response=>{
      this.transbankConfirm = response;
      console.log(response);
    })
  }

  


}
