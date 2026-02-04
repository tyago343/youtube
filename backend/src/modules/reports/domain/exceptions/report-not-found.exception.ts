export class ReportNotFoundException extends Error {
  constructor(message: string = 'Report not found') {
    super(message);
    this.name = 'ReportNotFoundException';
  }
}
