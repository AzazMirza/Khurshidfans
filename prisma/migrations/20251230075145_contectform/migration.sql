-- AlterTable
CREATE SEQUENCE contactform_id_seq;
ALTER TABLE "ContactForm" ALTER COLUMN "id" SET DEFAULT nextval('contactform_id_seq');
ALTER SEQUENCE contactform_id_seq OWNED BY "ContactForm"."id";
