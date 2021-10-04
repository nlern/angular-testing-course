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
  let findAllCoursesSpy: jasmine.Spy;

  const begineerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  beforeEach(
    waitForAsync(async () => {
      const coursesService = jasmine.createSpyObj("CoursesService", [
        "findAllCourses",
      ]);
      findAllCoursesSpy = coursesService.findAllCourses.and.returnValue(
        of(begineerCourses)
      );
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

  it("should not show courses before OnInit", () => {
    const tabs = el.queryAll(By.css("mat-tab"));
    expect(tabs.length).toBe(0, "nothing displayed");
    expect(findAllCoursesSpy.calls.any()).toBe(
      false,
      "findAllCourses not yet called"
    );
  });

  it("should display only beginner courses", () => {
    fixture.detectChanges();

    expect(findAllCoursesSpy.calls.any()).toBe(true, "findAllCourses called");

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "only one tab shown");

    const tabLabel = (
      tabs[0].query(By.css(".mat-tab-label-content"))
        .nativeElement as HTMLElement
    ).textContent;
    expect(tabLabel).toBe("Beginners", "tab label is beginner");
  });

  it("should display only advanced courses", () => {
    pending();
  });

  it("should display both tabs", () => {
    pending();
  });

  it("should display advanced courses when tab clicked", () => {
    pending();
  });
});
