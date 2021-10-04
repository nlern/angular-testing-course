import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const begineerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(
    waitForAsync(async () => {
      coursesService = jasmine.createSpyObj("CoursesService", [
        "findAllCourses",
      ]);
      await TestBed.configureTestingModule({
        imports: [CoursesModule, NoopAnimationsModule],
        providers: [
          {
            provide: CoursesService,
            useValue: coursesService,
          },
        ],
      });

      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    })
  );

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(begineerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "only one tab shown");

    const tabLabel = (
      tabs[0].query(By.css(".mat-tab-label-content"))
        .nativeElement as HTMLElement
    ).textContent;
    expect(tabLabel).toBe("Beginners", "tab label is beginner");
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "only one tab shown");

    const tabLabel = (
      tabs[0].query(By.css(".mat-tab-label-content"))
        .nativeElement as HTMLElement
    ).textContent;
    expect(tabLabel).toBe("Advanced", "tab label is advanced");
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "both tabs are shown");
  });

  it("should display advanced courses when tab clicked", () => {
    pending();
  });
});
