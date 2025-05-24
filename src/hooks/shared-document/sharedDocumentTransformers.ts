
import { SharedDocument } from "./sharedDocumentTypes";

export const transformSharedDocument = (documentData: any): SharedDocument => {
  return {
    document_id: documentData.document_id,
    document_type: documentData.document_type,
    document_data: documentData.document_data as SharedDocument['document_data'],
    user_id: documentData.user_id,
    shared_at: documentData.shared_at
  };
};

export const transformFromAccessCode = (docData: any, accessCodeData: any): SharedDocument => {
  return {
    document_id: docData.id,
    document_type: 'pdf_document',
    document_data: {
      file_name: docData.file_name,
      file_path: docData.file_path,
      content_type: docData.content_type,
      description: docData.description
    },
    user_id: docData.user_id || accessCodeData.user_id,
    shared_at: accessCodeData.created_at
  };
};
