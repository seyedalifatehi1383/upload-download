import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import multer from 'multer';
import {RepositoryMixin} from '@loopback/repository';
import {HttpErrors, RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import{FILE_UPLOAD_SERVICE,STORAGE_DIRECTORY} from './keys';
import {MySequence} from './sequence';
import {FileUploadController} from './controllers';
export {ApplicationConfig};
import { namefile } from "./controllers/file-upload.controller";


export class UploadDownloadApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.configureFileUpload(options.fileStorageDirectory );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }


  configureFileUpload(destination?: string) {
    // Upload files to `dist/.sandbox` by default
    destination = destination ?? path.join(__dirname, '../file');
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,

        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, namefile + '.' + file.originalname.split('.')[1]);

        },

      }),

      limits : {siz}
      fileFilter : function(req , file , cd ){
        checkFileType(file , cd)
      },

    };



    function checkFileType(file : Express.Multer.File , cd : multer.FileFilterCallback){
      console.log(file);

      if (file.originalname.split('.')[1] == 'png') {
        return cd(null , true)
        // if (file.size < 10485760) {

        // } else {
        //   return cd(new HttpErrors.Forbidden('file could not be more that 2 bytes'))
        // }
      }else{
        return cd(new HttpErrors.Forbidden('file suffix should be png '))
      }

    }

    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);


   }

}
