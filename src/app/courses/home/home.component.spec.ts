import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";

import { CoursesModule } from "../courses.module";

import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesServiceSpy: { findAllCourses: jest.Mock };

  const begineerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  beforeEach(
    waitForAsync(async () => {
      coursesServiceSpy = { findAllCourses: jest.fn() };
      TestBed.configureTestingModule({
        imports: [CoursesModule, NoopAnimationsModule, RouterTestingModule],
        providers: [
          {
            provide: CoursesService,
            useValue: coursesServiceSpy,
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
    coursesServiceSpy.findAllCourses.mockImplementation(() =>
      of(begineerCourses)
    );

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1);

    const tabLabel = (
      tabs[0].query(By.css(".mat-tab-label-content"))
        .nativeElement as HTMLElement
    ).textContent;
    expect(tabLabel).toBe("Beginners");
  });

  it("should display only advanced courses", () => {
    coursesServiceSpy.findAllCourses.mockImplementation(() =>
      of(advancedCourses)
    );

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1);

    const tabLabel = (
      tabs[0].query(By.css(".mat-tab-label-content"))
        .nativeElement as HTMLElement
    ).textContent;
    expect(tabLabel).toBe("Advanced");
  });

  it("should display both tabs", () => {
    coursesServiceSpy.findAllCourses.mockImplementation(() =>
      of(setupCourses())
    );

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2);
  });

  it(
    "should display advanced courses when tab clicked",
    waitForAsync(async () => {
      coursesServiceSpy.findAllCourses.mockImplementation(() =>
        of(setupCourses())
      );
      fixture.detectChanges();

      const tabs = el.queryAll(By.css(".mat-tab-label"));

      click(tabs[1]);
      fixture.detectChanges();

      await fixture.whenStable();

      const cardTitles = el.queryAll(
        By.css(".mat-tab-body-active .mat-card-title")
      );
      expect(cardTitles.length).toBeGreaterThan(0);
      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    })
  );
});
