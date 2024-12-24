import { test } from "@playwright/test";

test('Login to school website as a student and as a teacher at the same time @isolation', async ({ browser }) => {
  test.slow();

  const studentContext = await browser.newContext();
  const teacherContext = await browser.newContext();

  const studentPage = await studentContext.newPage();
  const teacherPage = await teacherContext.newPage();

  await studentPage.goto("https://school.moodledemo.net/login/index.php");
  await studentPage.getByPlaceholder('Username').fill("student");
  await studentPage.getByPlaceholder("Password").fill("moodle");
  await studentPage.locator("#loginbtn").click();

  await teacherPage.goto("https://school.moodledemo.net/login/index.php");
  await teacherPage.getByPlaceholder('Username').fill("teacher");
  await teacherPage.getByPlaceholder("Password").fill("moodle");
  await teacherPage.locator("#loginbtn").click();

  await studentPage.pause();
  await teacherPage.pause();

  await studentPage.close();
  await teacherPage.close();

  await studentContext.close();
  await teacherContext.close();
});
