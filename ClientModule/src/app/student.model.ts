export class Student {
    public id: string;
    public name: string;
    public firstName: string;
    public courseId : number = 0;

    constructor(id: string, name: string, firstName: string, courseId?:number) {
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        if(courseId) this.courseId = courseId;
    }

    static sortData(a: Student, b: Student) {
      // sort data by name, then firstName, then id
      if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
      if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) { return 1; }
      if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) { return -1; }
      if (a.id.toLowerCase() > b.id.toLowerCase()) { return 1; }
      if (a.id.toLowerCase() < b.id.toLowerCase()) { return -1; }
      return 0;
    }
}
