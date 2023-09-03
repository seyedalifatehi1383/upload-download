
import {inject} from '@loopback/core';
import {
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {FileUploadHandler} from '../types';
import multer from 'multer';
import {resolve} from 'path';
import {rejects} from 'assert';
export {namefile};

let namefile = 'ali.png'
var store = multer.diskStorage({
  destination : function (req,file, cd){
    cd(null,'../../file')
  },

  filename :function(req,file,cd){
    cd(null,file.originalname)
  }
})

var upload = multer({ storage: store }).single("demo_image");

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
  /**
   * Constructor
   * @param handler - Inject an express request handler to deal with the request
   */
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
  ) {}




  @post('/profile', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async uploadAvatar(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {


    return new Promise<object>(async (resolve, reject) => {
      this.handler(request, response, async (err: unknown) => {
        if (err) {
          reject(err);

        }
        else {
          resolve(FileUploadController.getFilesAndFields(request));

        }
      });
    });
  }



  @post('/files/{name}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @param.path.string('name') name : string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    return new Promise<object>(async (resolve, reject) => {
      namefile = name
      this.handler(request, response, async (err: unknown) => {
        if (err) {
          reject(err);

        }
        else {

          resolve(FileUploadController.getFilesAndFields(request));

        }
      });
    });



  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });

    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);

    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return {files, fields: request.body};
  }




}
